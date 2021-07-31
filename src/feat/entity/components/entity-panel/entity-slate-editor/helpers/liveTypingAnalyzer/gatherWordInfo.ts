import { Point } from 'slate'
import * as Slate from 'slate'

import * as model from '../../model'

export function gatherWordInfo(editor: any, cursorPoint: Point, curData: model.CursorPositionData) {
  /**
   * Word before cursor
   */

  const wordPointBeforeCursor = Slate.Editor.before(editor, cursorPoint, { unit: 'word' })
  const wordBeforeCursorPoint =
    wordPointBeforeCursor && Slate.Editor.before(editor, wordPointBeforeCursor)
  curData.analysisRanges.wordBeforeCursorRange =
    wordBeforeCursorPoint && Slate.Editor.range(editor, wordBeforeCursorPoint, cursorPoint)

  // TODO - figure out why wordPointBeforeCursor doesn't appear to be resolving to the word before correctly.
  //   console.log(`wordPointBeforeCursor`, wordPointBeforeCursor, "cursor point", cursorPoint);

  curData.wordInfo.wordBeforeCursor =
    (curData.analysisRanges.wordBeforeCursorRange &&
      Slate.Editor.string(editor, curData.analysisRanges.wordBeforeCursorRange)) ||
    ''
  const currentWordStartsWithAtSymbolMatch =
    curData.wordInfo.wordBeforeCursor &&
    curData.wordInfo.wordBeforeCursor.match(model.regexMatchers.wordThatStartsWithAtSymbol)
  //   console.log(`currentWordStartsWithAtSymbolMatch`, currentWordStartsWithAtSymbolMatch);
  //   console.log(curData.wordInfo.wordStartsWithAtSymbol);
  curData.wordInfo.wordStartsWithAtSymbol =
    currentWordStartsWithAtSymbolMatch != null && currentWordStartsWithAtSymbolMatch !== ''
  //   console.log(curData.wordInfo.wordStartsWithAtSymbol);
  curData.wordInfo.wordFollowingAtSymbol =
    (currentWordStartsWithAtSymbolMatch && currentWordStartsWithAtSymbolMatch[1]) || undefined

  /**
   * Word before current word
   */
  const wordBeforeCurrentWordPoint =
    wordBeforeCursorPoint && Slate.Editor.before(editor, wordBeforeCursorPoint, { unit: 'word' })
  curData.analysisRanges.wordBeforeCurrentWordRange =
    wordBeforeCurrentWordPoint &&
    Slate.Editor.range(editor, wordBeforeCurrentWordPoint, wordBeforeCursorPoint)
  const wordBeforeCurrentWordString =
    curData.analysisRanges.wordBeforeCurrentWordRange &&
    Slate.Editor.string(editor, curData.analysisRanges.wordBeforeCurrentWordRange)
  const wordBeforeCurrentWordLastChar =
    wordBeforeCurrentWordString && wordBeforeCurrentWordString?.trim()?.slice(-1)
  const wordBeforeCurrentWordLastCharPuncMatch = wordBeforeCurrentWordLastChar?.match(
    model.regexMatchers.isPunctuationMark,
  )
  // const prevWordHasPunctuation = wordBeforeCurrentWordLastCharPuncMatch != null;
  curData.wordInfo.prevWordHasPunctuation = wordBeforeCurrentWordLastCharPuncMatch != null
}
