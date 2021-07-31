import './index.css'

import { Router } from '@reach/router'
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './feat/home/components/app.component'
import { LandingPage } from './feat/home/components/landing-page.component'
import { ErrorBoundary } from './feat/telemetry/components/error-boundary.component'
import { repoMgr } from './common/storage/repos/repo-manager.service'

const RoutedApp = () => {
  return (
    <ErrorBoundary regionName="App Wrapper">
      <Router>
        <App path="/*" />
        <LandingPage path="/welcome" />
        {/* <LoggedOutPage path="/comeagain" /> */}
        {/* <LoginPage path="/login" /> */}
      </Router>
    </ErrorBoundary>
  )
}

async function renderView() {
  ReactDOM.render(<RoutedApp />, document.getElementById('root'))
}

void renderView()

// Init Repo
void repoMgr.init()
