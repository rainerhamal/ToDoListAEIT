import * as React from 'react';
import styles from './ToDoListAeit.module.scss';
import { IToDoListAeitProps } from './IToDoListAeitProps';
import { escape } from '@microsoft/sp-lodash-subset';


export default class ToDoListAeit extends React.Component<IToDoListAeitProps, {}> {
  public render(): React.ReactElement<IToDoListAeitProps> {
    const {
      onOpenPanel,
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.toDoListAeit} ${hasTeamsContext ? styles.teams : ''}`}>
        {/* <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div> */}
        <div className={styles.buttons}>
          <button type="button" onClick={this.onOpenPanelClicked}>Add Task</button>

          {/* <button type="button" onClick={this.onAddListItemClicked}>Add List Item</button> */}
          {/* <button type="button" onClick={this.onUpdateListItemClicked}>Update List Item</button>
          <button type="button" onClick={this.onDeleteListItemClicked}>Delete List Item</button> */}
        </div>
      </section>
    );
  }

  private onOpenPanelClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  
    this.props.onOpenPanel();
    // this.context.propertyPane.open();
  }

  // private onAddListItemClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
  //   event.preventDefault();
  
  //   this.props.onAddListItem();
  // }
  
  // private onUpdateListItemClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
  //   event.preventDefault();
  
  //   this.props.onUpdateListItem();
  // }
  
  // private onDeleteListItemClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
  //   event.preventDefault();
  
  //   this.props.onDeleteListItem();
  // }
}
