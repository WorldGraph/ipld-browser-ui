import React from 'react'
import * as Slate from 'slate'

import * as model from '../model'
import { gatherAtInfo } from './liveTypingAnalyzer/gatherAtInfo'
import { gatherCharInfo } from './liveTypingAnalyzer/gatherCharInfo'
import { gatherLineInfo } from './liveTypingAnalyzer/gatherLineInfo'
import { gatherParagraphInfo } from './liveTypingAnalyzer/gatherParagraphInfo'
import { gatherSentenceInfo } from './liveTypingAnalyzer/gatherSentenceInfo'
import { gatherWordInfo } from './liveTypingAnalyzer/gatherWordInfo'
import { setSearchType } from './liveTypingAnalyzer/setSearchType'

// Position Info

export function analyzeLiveTypingOnChange(
  editor: any,
  setLtBoxTarget: (value: any) => void,
  setSearchString: (value: React.SetStateAction<string | null>) => void,
  setLtSelectionIndex: (value: React.SetStateAction<number>) => void,
  curInfo: model.CursorPositionData,
  //   setCurData: (value: React.SetStateAction<model.CursorPostionData>) => void
  setCurData: (value: model.CursorPositionData) => void,
) {
  //   const curData: model.CursorPostionData = {};
  const curData = { ...curInfo }

  // reset ranges
  curData.analysisRanges = {}

  const { selection } = editor
  // Range.isCollapsed indicates that the cursor is at a single point currently - user has not selected a range.
  if (selection && Slate.Range.isCollapsed(selection)) {
    const [cursorPoint] = Slate.Range.edges(selection)

    gatherCharInfo(editor, cursorPoint, curData)
    gatherWordInfo(editor, cursorPoint, curData)
    // gatherPreceedingNodeInfo(editor, cursorPoint, analysisRanges, curData);
    gatherLineInfo(editor, cursorPoint, curData)
    gatherSentenceInfo(editor, cursorPoint, curData)
    gatherParagraphInfo(editor, cursorPoint, curData)
    gatherAtInfo(editor, cursorPoint, curData)

    setSearchType(curData)

    /**
     * Display cursor data for
     */
    // console.log(`curData `, curData);
    setCurData(curData)

    /**
     * Final actions
     */

    // Case if typing a relation

    /**
     * current "at" word within the current "lineBeforeCursorRange"
     * Need to have the "point" of the previous "@" symbol *within* the lineBeforeCursorRange.
     * Need to then compute the range between the "@" and the cursor (inclusive) AND set that to the ltBoxTarget
     * need the equivalent of this....but first need the "point of at preceeding cursor".  Can I do Editor.before
        const wordPointBeforeCursor = Editor.before(editor, cursorPoint, { unit: "word" });
        const wordBeforeCursorPoint = wordPointBeforeCursor && Editor.before(editor, wordPointBeforeCursor);
        Note, MIGHT be able to just do Editor.before(editor, cursorPoint, {distance: n}), where n is the number of chars back to go
     */
    if (curInfo.atInfo.currentSentenceContainsAt) {
      // Applies to ALL search types
      setLtBoxTarget(curData.analysisRanges.atRange)
      setSearchString(curData.lineInfo.lineAfterAtText || '')
      setLtSelectionIndex(0)
      return
    }

    if (curData.charInfo.cursorIsPreceededByPunctuation) {
      // If Preceeded by punctuation, don't do any live typing selection
      setLtBoxTarget(null)
      setSearchString(null)
      return
    }

    if (curData.wordInfo.wordStartsWithAtSymbol) {
      // Current word (contiguous) starts with at symbol.
      // TODO - is this what we actually want?  I think I might want to keep spaces in the "searching".
      setLtBoxTarget(curData.analysisRanges.wordBeforeCursorRange)
      setSearchString(curData.wordInfo.wordFollowingAtSymbol || '')
      setLtSelectionIndex(0)
      return
    }

    if (
      curData.sentenceInfo.isFirstWordInSentence &&
      curData.paragraphInfo.isFirstNodeInParagraph &&
      curData.nodeInfo.isFirstWordInNode &&
      (curData.lineInfo.lineBeforeCursorText === 't' ||
        curData.lineInfo.lineBeforeCursorText === 'th' ||
        curData.lineInfo.lineBeforeCursorText === 'thi' ||
        curData.lineInfo.lineBeforeCursorText === 'this')
    ) {
      setLtBoxTarget(curData.analysisRanges.lineBeforeCursorRange)
      setSearchString(curData.wordInfo.wordBeforeCursor || '')
      setLtSelectionIndex(0)
      return
    }

    // TODO - revisit this.  causing issues.
    // if (curData.isFirstWordInSentence && curData.wordBeforeCursor !== "" && !curData.isParagraphBegin) {
    //   setLtBoxTarget(wordBeforeCursorRange);
    //   setSearchString(curData.wordBeforeCursor);
    //   setLtSelectionIndex(0);
    //   return;
    // }

    if (curData.charInfo.charBeforeCursor === '@') {
      setLtBoxTarget(curData.analysisRanges.charBeforeCursorRangeMinus1)
      setSearchString('')
      return
    }

    setLtBoxTarget(null)
    setSearchString(null)
  }
}
