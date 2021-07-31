import { Point } from 'slate'
import * as model from '../../model'
import * as Slate from 'slate'

export function gatherAtInfo(editor: any, cursorPoint: Point, curData: model.CursorPositionData) {
  const currSentenceAtMatch = curData.sentenceInfo.currentSentenceText?.match(
    model.regexMatchers.matchAtSymbol,
  )
  curData.atInfo.currentSentenceContainsAt = currSentenceAtMatch != null
  if (curData.atInfo.currentSentenceContainsAt) {
    const split = curData.sentenceInfo.currentSentenceText?.split('@')
    const lenBackToAt = split && split[split?.length - 1].length + 1
    const atPoint = Slate.Editor.before(editor, cursorPoint, { distance: lenBackToAt || 0 })
    curData.analysisRanges.atRange = atPoint && Slate.Editor.range(editor, atPoint, cursorPoint)
    curData.lineInfo.lineAfterAtText =
      curData.analysisRanges.atRange &&
      Slate.Editor.string(editor, curData.analysisRanges.atRange)?.substr(1)
  }
}
