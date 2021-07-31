import React from 'react'
import * as model from './model'
import * as subComponents from './EditorElement/subComponents'
export function EditorElement(props: { attributes: any; children: any; element: any }) {
  //   console.log(`rendering element with children `, param.children?.props?.node);
  //   console.log(`rendering element of type ${props.element.type}`);
  switch (props.element.type) {
    case model.NodeType.entity:
      //   console.log(`RENDERING MENTION ELEMENT`, props.element);
      return <subComponents.EntityLinkElement {...props} />
    case model.NodeType.link:
      return (
        <a {...props.attributes} href={props.element.url} target="_blank">
          {props.children}
        </a>
      )
    case 'block-quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>
    case 'bulleted-list':
      return <ul {...props.attributes}>{props.children}</ul>
    case 'heading-one':
      return <h1 {...props.attributes}>{props.children}</h1>
    case 'heading-two':
      return <h2 {...props.attributes}>{props.children}</h2>
    case 'list-item':
      return <li {...props.attributes}>{props.children}</li>
    case 'numbered-list':
      return <ol {...props.attributes}>{props.children}</ol>
    default:
      return <p {...props.attributes}>{props.children}</p>
  }
}
