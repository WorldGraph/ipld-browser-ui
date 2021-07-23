import './index.css'

import { Router } from '@reach/router'
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './feat/home/components/app.component'
import { LandingPage } from './feat/home/components/landing-page.component'
import { ErrorBoundary } from './feat/telemetry/components/error-boundary.component'
import { ConfigService } from './common/config/config.service'
import { repoMgr } from './common/storage/repos/repo-manager.service'

ConfigService.setTextileHubKey('bn6zcf5mzp4mgdcgrulueviflry')

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

// Init websocket
// registerSocket();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
