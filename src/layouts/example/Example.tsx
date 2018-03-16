import * as React from 'react';

import './example.css';

class Msg {
  public type: 'message';
  public ts: '1358878749.000002';
  public user: 'U023BECGF';
  public text: string;

  constructor(msg: string) {
    this.text = msg;
  }
}

export default class Example extends React.Component {
  public state = {
    msgs: [] as Msg[],
    inputText: ''
  };
  public list: HTMLElement;
  public itemHeight: number = 0;

  public componentWillMount() {
    setInterval(() => {
      this.addMsg(new Msg(Math.random().toString()));
    }, 5000);
  }

  public addMsg(msg: Msg) {
    this.setState({ ...this.state, ...{ msgs: this.state.msgs.concat([msg]) } }, () => {
      this.list.scrollTop = this.list.offsetHeight;
    });
  }

  public onSubmit(event: Event) {
    event.preventDefault();
    this.addMsg(new Msg(this.state.inputText));
    setTimeout(() => this.onInputChange(''));
  }

  public onInputChange(inputText: string) {
    this.setState({ ...this.state, inputText });
  }

  public onKeyUp(code: number) {
    if (code === 38) this.list.scrollTop = this.list.scrollTop - this.itemHeight;
    if (code === 40) this.list.scrollTop = this.list.scrollTop + this.itemHeight;
  }

  public render(): JSX.Element {
    return (
      <div>
        <form onSubmit={(event: any) => this.onSubmit(event)}>
          <input
            value={this.state.inputText}
            onChange={(e) => this.onInputChange(e.target.value)}
            onKeyUp={(e: any) => this.onKeyUp(e.keyCode)}
          />
        </form>
        <div ref={e => this.list = e} className="list">
          {this.state.msgs.map((msg, i) => <p
            className="list__item"
            key={i}
            ref={e => this.itemHeight = e ? e.offsetHeight : this.itemHeight}
          >
            {msg.text}
          </p>)}
        </div>
      </div>
    );
  }
}
