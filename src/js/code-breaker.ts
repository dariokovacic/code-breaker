import { Alert, Modal } from 'bootstrap';

export default class CodeBreaker {
  code: string = '';
  attempt: number = 1;

  game: HTMLElement | null;
  guessButton: HTMLElement | null;
  userInput: HTMLInputElement | null;
  notification: HTMLInputElement | null;
  results: HTMLElement | null;
  playAgain: HTMLElement | null;
  alert: Alert;

  constructor() {
    this.game = document.querySelector('.js-game');
    this.notification = document.querySelector('.notification');
    this.guessButton = this.game!.querySelector('.guess');
    this.userInput = this.game!.querySelector('.user-input');
    this.results = this.game!.querySelector('.results');
    this.playAgain = document.createElement('button');
    this.alert = new Alert('.notification');

    this.init();
  }

  init() {
    this.generateCode();
    this.bindEvents();
  }

  bindEvents() {
    this.guessButton!.addEventListener('click', () => {
      this.guess();
      this.userInput?.blur();
    });

    this.userInput!.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.guessButton!.click();
        this.userInput?.blur();
      }
    });

    this.playAgain?.addEventListener('click', () => {
      location.reload();
    });
  }

  guess() {
    if (this.validInput()) {
      // noinspection FallThroughInSwitchStatementJS
      switch (this.getResults()) {
        case true:
          this.showCode();
          this.showModal('success', 'You win.');
          this.game?.querySelector('.input-group')?.classList.add('d-none');
          break;
        case false:
          if (this.attempt >= 10) {
            this.showCode();
            this.showModal('danger', 'You lost.');
            this.game?.querySelector('.input-group')?.classList.add('d-none');
            break;
          }
        default:
          this.showNotification('primary', 'Wrong code, try again.');
          break;
      }
      this.attempt++;
    }
  }

  getResults() {
    const input = this.userInput!.value;
    let resultSpan = document.createElement('span');
    let correctDigits = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === this.code[i]) {
        resultSpan.appendChild(this.createIcon('check-lg'));
        correctDigits++;
      } else if (input[i] === this.code[0] || input[i] === this.code[1] || input[i] === this.code[2] || input[i] === this.code[3]) {
        resultSpan.appendChild(this.createIcon('arrow-left-right'));
      } else if (input[i] !== this.code[0] && input[i] !== this.code[1] && input[i] !== this.code[2] && input[i] !== this.code[3]) {
        resultSpan.appendChild(this.createIcon('x-circle'));
      }
    }

    this.results?.classList.remove('invisible');
    const resultRow = document.createElement('li');
    resultRow.classList.add('result-row', 'list-group-item', 'px-2');

    const attemptSpan = document.createElement('span');
    attemptSpan.classList.add('ms-1');
    attemptSpan.innerHTML = this.attempt.toString() + '.';

    const inputSpan = document.createElement('span');

    inputSpan.innerHTML = input;

    resultRow.appendChild(attemptSpan);
    resultRow.appendChild(inputSpan);
    resultRow.appendChild(resultSpan);

    this.results?.appendChild(resultRow);

    return correctDigits === 4;
  }

  generateCode() {
    let code = Math.floor(Math.random() * 9999).toString();
    while (code.length < 4) {
      code = '0' + code;
    }

    this.code = code;
  }

  validInput() {
    if (this.userInput!.value.length === 4) {
      return true;
    }

    this.showNotification('danger', 'You didn\'t enter 4 digits');
    return false;
  }

  showNotification(type: string, msg: string) {
    const notification = document.createElement('div');
    notification.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    notification.setAttribute('role', 'alert');

    const msgContainer = document.createElement('div');
    msgContainer.innerHTML = msg;

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('btn-close');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');

    notification.appendChild(msgContainer);
    notification.appendChild(closeBtn);

    this.notification!.appendChild(notification);

    window.setTimeout(() => {
      closeBtn.click();
    }, 4000);
  }

  showModal(type: string, msg: string) {
    const modal = document.createElement('div');
    const modalDialog = document.createElement('div');
    const modalContent = document.createElement('div');

    const modalHeader = document.createElement('div');
    const modalTitle = document.createElement('h2');

    const modalBody = document.createElement('div');
    const playAgain = this.playAgain;

    modal.classList.add('modal', 'fade');
    modal.setAttribute('data-bs-backdrop', 'static');
    modal.setAttribute('data-bs-keyboard', 'false');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
    modalContent.classList.add('modal-content');

    modalHeader.classList.add('modal-header');
    modalTitle.classList.add('modal-title', 'ms-3');
    if (type === 'success') {
      modalHeader.appendChild(this.createIcon('check-circle-fill'));
    } else {
      modalHeader.appendChild(this.createIcon('x-circle-fill'));

    }
    modalTitle.append(msg);

    modalBody.classList.add('modal-body');
    playAgain?.classList.add('btn', 'btn-success', 'play-again');
    playAgain?.setAttribute('type', 'button');
    playAgain!.innerText = 'Play Again';

    modalHeader.appendChild(modalTitle);
    modal.appendChild(modalDialog).appendChild(modalContent).appendChild(modalHeader);
    modalContent.appendChild(modalBody).appendChild(playAgain!);
    this.game?.appendChild(modal);

    const endScreen = new Modal('.modal');
    endScreen.show();
  }

  createIcon(iconClass: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add('bi', `bi-${iconClass}`, 'mx-1');

    return icon;
  }

  showCode() {
    const codeContainerChildren = Array.from(this.game!.querySelector('ul.code')!.children);

    codeContainerChildren.forEach((li, index) => {
      li.removeChild(li.lastChild!);
      li.innerHTML = this.code[index];
    });
  }
}
