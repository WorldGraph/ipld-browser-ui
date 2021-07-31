import { Editor, Range, Transforms } from 'slate'
import * as SlateReact from 'slate-react'
import { EntityElement, LinkElement } from '../../../../../../common/slate_config/custom-types'

import { isUrl } from '../../../../../../common/util/url'
import { IndexedItem } from '../../../../../search/IxSearchModel/IndexedItem'
import { curDataContainer } from '../../entity-slate-editor.component'
import * as model from '../model'

export function insertSubjEntityLink(editor: any, indexedItem: IndexedItem) {
  const { selection } = editor
  const entityLink: EntityElement = {
    type: model.NodeType.entity,
    indexedItem: indexedItem,
    children: [{ text: indexedItem.name }],
  }
  // TODO - figure out why this node is being inserted as inline on previous paragraph instead of in a new node.
  Transforms.insertNodes(editor, entityLink)
  Transforms.move(editor)
}

export function withModifiers(editor: Editor & SlateReact.ReactEditor) {
  const { isInline, isVoid, insertText, insertData, insertBreak } = editor

  // If this is an inline node type, set to inline
  editor.isInline = (element: any) => {
    if (element.type === model.NodeType.entity) return true
    if (element.type === model.NodeType.link) return true

    return isInline(element)
  }

  editor.insertBreak = () => {
    // console.log(`Insert break, curdata is `, curDataContainer.curData);
    // IF previous char is a newline...we want to insert break.  Otherwise not.
    if (
      curDataContainer.curData.charInfo.charBeforeCursor === '\n' &&
      curDataContainer.curData.analysisRanges.charBeforeCursorRange != null
    ) {
      //   console.log(`char before cursor is a newline`);
      Transforms.select(editor, curDataContainer.curData.analysisRanges.charBeforeCursorRange)
      insertBreak()
    } else {
      insertText('\n')
    }
    // return insertBreak();
  }

  // If this is a void node type, set to void
  editor.isVoid = (element: any) => {
    if (element.type === model.NodeType.entity) return true

    return isVoid(element)
  }

  editor.insertText = (text: any) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

// Links
function unwrapLink(editor: any) {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' })
}

function wrapLink(editor: any, url: any) {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

function isLinkActive(editor: any) {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === model.NodeType.link })
  return !!link
}
