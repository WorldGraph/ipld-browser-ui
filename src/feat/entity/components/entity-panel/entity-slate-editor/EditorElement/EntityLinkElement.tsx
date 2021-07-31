import React from 'react'
import * as SlateReact from 'slate-react'
import * as model from '../model'
import { navigateWithCtrlSensitivity } from '../../../../../../common/util/navigate'

export function EntityLinkElement(props: model.MentionElementProps) {
  const selected = SlateReact.useSelected()
  const focused = SlateReact.useFocused()
  //   console.log(`render subject element `, props.element);
  return (
    <span
      {...props.attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: 'lightblue',
        fontSize: '0.9em',
        cursor: 'pointer',
        textDecoration: 'underline',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
      onClick={(e) => {
        console.log(`navigate to ${props.element.indexedItem.id}`)
        navigateWithCtrlSensitivity(`/item/${props.element.indexedItem.id}`, e)
      }}
    >
      {props.element?.indexedItem?.name}
      {props.children}
    </span>
  )
}
