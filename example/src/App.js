import React, { Component } from 'react'
import './App.css';

import Home from 'react-async-tracker/example/src/Home';
import About from 'react-async-tracker/example/src/About';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 1,
    };
  }

  handleIndexChange(number) {
    this.setState({ index: number });
  }

  render() {
    const { index } = this.state;

    return (
      <div style={{width: '100%', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap'}}>
        <div className="tab" onClick={() => this.handleIndexChange(0)}>Home</div>
        <div className="tab" onClick={() => this.handleIndexChange(1)}>About</div>

        <div style={{ display: 'block', marginTop: 30, width: '100%' }}>
          {index === 0 ? (
            <Home/>
          ) : (
            <About/>
          )}</div>
      </div>
    )
  }
}

export default App;
