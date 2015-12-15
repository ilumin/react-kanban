import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
  }

  create(note) {

  }

  update({id, task}) {

  }

  delete(id) {

  }
}

export default alt.createStore(NoteStore, 'NoteStore');
