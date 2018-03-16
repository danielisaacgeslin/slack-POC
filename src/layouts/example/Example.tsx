import * as React from 'react';

import HttpService from '../../services/Http.service';
import './example.css';

const token = '';

class Msg {
  public type: string = 'message';
  public ts: string = undefined;
  public user: string = '...';
  public channel: string = 'C9AD5LPJB';
  public text: string = '';

  constructor(msg: string, user?: string) {
    this.text = msg;
    if (user) this.user = user;
  }
}

export default class Example extends React.Component {
  public state = {
    msgs: [] as Msg[],
    inputText: '',
    connected: false
  };
  public list: HTMLElement;
  public itemHeight: number = 0;
  public socket: WebSocket;

  public async connect() {
    const res: any = await HttpService.get('https://slack.com/api/rtm.connect', { params: { token } });
    this.socket = new WebSocket(res.url);
    // console.log()
    this.socket.onopen = () => this.setState({ ...this.state, connected: true });
    this.socket.onerror = error => console.error('error', error);
    this.socket.onclose = () => this.setState({ ...this.state, connected: false });
    this.socket.onmessage = msg => {
      const data = JSON.parse(msg.data);
      if (data.text) this.addMsg(new Msg(data.text, data.user));
    };
  }

  public componentWillMount() {
    this.connect();
  }

  public addMsg(msg: Msg) {
    this.setState({ ...this.state, ...{ msgs: this.state.msgs.concat([msg]) } }, () => {
      this.list.scrollTop = this.list.offsetHeight;
    });
  }

  public onSubmit(event: Event) {
    event.preventDefault();
    this.socket.send(JSON.stringify(new Msg(this.state.inputText)));
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
            disabled={!this.state.connected}
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
            {msg.user}: {msg.text}
          </p>)}
        </div>
      </div>
    );
  }
}
