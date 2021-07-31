import { Point } from 'slate'
import * as model from '../../model'
import * as Slate from 'slate'

export function gatherCharInfo(editor: any, cursorPoint: Point, curData: model.CursorPositionData) {
  /**
   * Char before cursor range (for target anchoring)
   */
  const charPointBeforeCursor = Slate.Editor.before(editor, cursorPoint, { unit: 'character' })
  curData.analysisRanges.charBeforeCursorRange =
    charPointBeforeCursor && Slate.Editor.range(editor, charPointBeforeCursor, cursorPoint)
  const charBeforeCursorPoint =
    charPointBeforeCursor && Slate.Editor.before(editor, charPointBeforeCursor)
  curData.analysisRanges.charBeforeCursorRangeMinus1 =
    charBeforeCursorPoint && Slate.Editor.range(editor, charBeforeCursorPoint, cursorPoint)
}
