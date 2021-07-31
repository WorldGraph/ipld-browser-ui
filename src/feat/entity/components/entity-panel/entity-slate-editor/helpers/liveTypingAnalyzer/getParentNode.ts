import { Node } from 'slate'
import * as Slate from 'slate'

import { getCurrentNode } from './getCurrentNode'

function getParentNode(editor: any, cursorPoint: Slate.Point): Slate.NodeEntry<Node> {
  const path = getCurrentNode(editor, cursorPoint)[1]
  const pathCopy = path.slice()
  pathCopy.pop()
  return Slate.Editor.node(editor, pathCopy)
}
