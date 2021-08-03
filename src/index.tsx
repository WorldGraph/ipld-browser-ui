import './index.css'

import { Router } from '@reach/router'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as MultiauthProvider } from '@ceramicstudio/multiauth'

import { App } from './feat/home/components/app.component'
import { LandingPage } from './feat/home/components/landing-page.component'
import { ErrorBoundary } from './feat/telemetry/components/error-boundary.component'
import { repoMgr } from './common/storage/repos/repo-manager.service'
import { LoggedOutPage } from './feat/authn/components/LoggedOutPage'
import { LoginPage } from './feat/authn/components/LoginPage'
import { multiauthConnectors } from './common/ceramic_utils/multiauth-connect'
import { multiauthTheme } from './common/ceramic_utils/multiauth-theme'

const RoutedApp = () => {
  return (
    <ErrorBoundary regionName="App Wrapper">
      <MultiauthProvider
        providers={[{ key: 'ethereum', connectors: multiauthConnectors }]}
        theme={multiauthTheme}
      >
        <Router>
          <App path="/*" />
          <LandingPage path="/welcome" />
          <LoggedOutPage path="/comeagain" />
          <LoginPage path="/login" />
        </Router>
      </MultiauthProvider>
    </ErrorBoundary>
  )
}

async function renderView() {
  ReactDOM.render(<RoutedApp />, document.getElementById('root'))
}

void renderView()

// Init Repo
void repoMgr.init()
