import type { CurrentProject, ProjectAxis } from '@/content/currentProjects';

export const PROJECT_AXES: readonly ProjectAxis[] = [
  'impact',
  'difficulty',
  'ambition',
  'creativity',
] as const;

export interface CourtPoint {
  left: number;
  top: number;
}

export interface ProjectCourtLayout {
  project: CurrentProject;
  point: CourtPoint;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getCourtPoint(project: CurrentProject, axis: ProjectAxis): CourtPoint {
  const health = project.trackerScore / 100;
  const axisGrade = project.grades[axis];
  const eliteLift = Math.max(0, axisGrade - 8) ** 1.35;
  const baselineGrade = Math.min(axisGrade, 8);
  const verticalScore = (baselineGrade - 5) * 7.2 + eliteLift * 13;
  const difficultyPressure = (project.grades.difficulty - 5.5) / 10;
  const creativeSpread = (project.grades.creativity - project.grades.impact) / 10;
  const statusDrag =
    project.trackerStatus === 'on_track'
      ? 0.03
      : project.trackerStatus === 'stalled'
        ? -0.06
        : -0.02;

  return {
    left: clamp(14 + health * 72 + creativeSpread * 7 + statusDrag * 100, 8, 92),
    top: clamp(72 - verticalScore + difficultyPressure * 4, 8, 90),
  };
}

function normalizeCourtPoints(points: readonly CourtPoint[]): CourtPoint[] {
  const leftValues = points.map((point) => point.left);
  const topValues = points.map((point) => point.top);
  const leftRange = Math.max(...leftValues) - Math.min(...leftValues);
  const topRange = Math.max(...topValues) - Math.min(...topValues);
  const minLeft = Math.min(...leftValues);
  const minTop = Math.min(...topValues);

  return points.map((point) => ({
    left: leftRange < 1 ? 50 : 10 + ((point.left - minLeft) / leftRange) * 80,
    top: topRange < 1 ? 48 : 8 + ((point.top - minTop) / topRange) * 80,
  }));
}

export function buildCourtLayout(
  projects: readonly CurrentProject[],
  axis: ProjectAxis,
): ProjectCourtLayout[] {
  const normalizedPoints = normalizeCourtPoints(
    projects.map((project) => getCourtPoint(project, axis)),
  );
  const points = projects.map((project, index) => ({ project, ...normalizedPoints[index] }));

  for (let pass = 0; pass < 24; pass += 1) {
    for (let first = 0; first < points.length; first += 1) {
      for (let second = first + 1; second < points.length; second += 1) {
        const a = points[first];
        const b = points[second];
        const deltaX = b.left - a.left;
        const deltaY = b.top - a.top;
        const distance = Math.hypot(deltaX, deltaY) || 0.01;
        const minimumDistance = 8;

        if (distance >= minimumDistance) continue;

        const push = (minimumDistance - distance) / 2;
        const unitX = deltaX / distance;
        const unitY = deltaY / distance;

        a.left = clamp(a.left - unitX * push, 7, 93);
        a.top = clamp(a.top - unitY * push, 7, 91);
        b.left = clamp(b.left + unitX * push, 7, 93);
        b.top = clamp(b.top + unitY * push, 7, 91);
      }
    }
  }

  return points.map(({ project, left, top }) => ({ project, point: { left, top } }));
}
