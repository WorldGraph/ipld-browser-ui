import { Button } from '@chakra-ui/react'
import React from 'react'
import { ErrorBoundary } from '../../telemetry/components/error-boundary.component'

export interface KnowledgeSummaryPanelProps {
  path?: string
}

export function KnowledgeSummaryPanel(props: KnowledgeSummaryPanelProps) {
  return (
    <ErrorBoundary regionName="Summary Panel">
      <Button style={{ width: '200px' }} onClick={() => {}}>
        Do thing
      </Button>
    </ErrorBoundary>
  )
}
