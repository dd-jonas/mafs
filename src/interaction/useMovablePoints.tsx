import React, { useMemo, useState } from "react"
import * as vec from "vec-la"
import { theme } from "../display/Theme"
import { Vector2 } from "../math"
import MovablePoint from "./MovablePoint"

const identity = vec.matrixBuilder().get()

export interface UseMovablePoints {
  points: Vector2[]
  elements: React.ReactElement[]
  setPoints: (...points: Vector2[]) => void
  addPoints: (...points: Vector2[]) => void
  updatePoint: (newPoint: Vector2, index: number) => void
  deletePoints: (n: number) => void
}

function useMovablePoints(initialPoints: Vector2[]): UseMovablePoints {
  const [points, setPoints] = useState<Vector2[]>(initialPoints)

  const updatePoints = (...points: Vector2[]) => {
    setPoints(points)
  }

  const addPoints = (...points: Vector2[]) => {
    setPoints((oldPoints) => [...oldPoints, ...points])
  }

  const updatePoint = (newPoint: Vector2, index: number) => {
    setPoints((oldPoints) => {
      return oldPoints.map((point, i) => (i === index ? newPoint : point))
    })
  }

  const deletePoints = (n: number) => {
    setPoints((points) => points.slice(0, -n))
  }

  const elements = useMemo(
    () =>
      points.map((point, i) => (
        <MovablePoint
          key={i}
          {...{ point, transform: identity, color: theme.pink }}
          constrain={([x, y]) => [x, y]}
          point={point}
          onMove={(newPoint) => {
            updatePoint(newPoint, i)
          }}
        />
      )),
    [points]
  )

  return {
    points,
    elements,
    setPoints: updatePoints,
    addPoints,
    updatePoint,
    deletePoints,
  }
}

export default useMovablePoints
