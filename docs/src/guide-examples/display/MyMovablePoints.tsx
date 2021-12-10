import React, { cloneElement } from "react"
// prettier-ignore
import { Mafs, FunctionGraph, CartesianCoordinates, useMovablePoints, Line, Theme, Vector2 } from "mafs"
import * as vec from "vec-la"

export default function MyMovablePoints() {
  const { points, elements, addPoints, deletePoints } =
    useMovablePoints([
      [0, 0],
      [2, 0],
      [1, 3],
      [2.5, 2.5],
    ])

  console.log("Points:", points)
  console.log("Elements:", elements)

  return (
    <>
      <Mafs height={500} yAxisExtent={[-1.3, 4.7]}>
        <CartesianCoordinates />
        <BezierCurve points={points} elements={elements} />
      </Mafs>

      <button
        onClick={() =>
          addPoints([1, 3.1], [2, 3.1], [3, 3.1])
        }
      >
        Add points
      </button>

      <button
        onClick={() => {
          if (points.length > 4) {
            deletePoints(3)
          }
        }}
      >
        Delete points
      </button>
    </>
  )
}

function BezierCurve({ points, elements }) {
  console.log("Bezier Points:", points)
  console.log("Bezier Elements:", elements)
  console.log("Bezier Quads:", inQuads(points))

  return (
    <>
      {/* Control lines */}
      {inPairs(points).map(([p1, p2], i) => (
        <Line.Segment
          key={i}
          point1={p1}
          point2={p2}
          opacity={0.25}
          color={Theme.pink}
        />
      ))}

      {/* Quadratic bezier lerp  */}
      {inQuads(points).map(([p1, c1, c2, p2], i) => (
        <FunctionGraph.Parametric
          key={i}
          t={[0, 1]}
          weight={3}
          xy={(t) =>
            xyFromBernsteinPolynomial(p1, c1, c2, p2, t)
          }
        />
      ))}

      {/* Movable points */}
      {elements.map((el, i) =>
        cloneElement(el, {
          key: i,
          color: i === 0 ? Theme.orange : Theme.green,
        })
      )}
    </>
  )
}

function xyFromBernsteinPolynomial(
  p1: Vector2,
  c1: Vector2,
  c2: Vector2,
  p2: Vector2,
  t: number
) {
  return [
    vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
    vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
    vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
    vec.scale(p2, t ** 3),
  ].reduce(vec.add, [0, 0])
}

function inPairs(arr: Vector2[]) {
  const pairs = []
  for (let i = 0; i < arr.length - 1; i++) {
    pairs.push([arr[i], arr[i + 1]])
  }

  return pairs
}

function inQuads(arr: Vector2[]) {
  const quads = []
  for (let i = 0; i < arr.length - 3; i += 3) {
    quads.push([arr[i], arr[i + 1], arr[i + 2], arr[i + 3]])
  }

  return quads
}
