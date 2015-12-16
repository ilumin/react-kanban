import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';

import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    if (!targetProps.lane.notes.length) {
      console.log('source', sourceId, 'target', targetProps);
    }
  }
};

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  constructor(props) {
    super(props);

    const id = props.lane.id;

    // bind this Lane object into action
    this.addNote = this.addNote.bind(this, id);
    this.deleteNote = this.deleteNote.bind(this, id);
    this.editName = this.editName.bind(this, id);
  }

  render() {
    const {
      connectDropTarget,
      lane,
      ...props
    } = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header">
          <Editable
            className="lane-name"
            value={lane.name}
            onEdit={this.editName}
          />
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.get(lane.notes)
          }}
        >
          <Notes
            onEdit={this.editNote}
            onDelete={this.deleteNote}
          />
        </AltContainer>
      </div>
    );
  }

  addNote(laneId) {
    NoteActions.create({ task: 'New task' });
    LaneActions.attachToLane({ laneId });
  }

  editNote(noteId, task) {
    NoteActions.update({
      id: noteId,
      task
    });
  }

  deleteNote(laneId, noteId) {
    LaneActions.detachFromLane({ laneId, noteId });
    NoteActions.delete(noteId);
  }

  editName(noteId, name) {
    if (name) {
      LaneActions.update({
        id: noteId,
        name
      });
    } else {
      LaneActions.delete(id);
    }
  }
};
