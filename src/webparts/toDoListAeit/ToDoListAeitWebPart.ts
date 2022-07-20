import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ToDoListAeitWebPartStrings';
import ToDoListAeit from './components/ToDoListAeit';
import { IToDoListAeitProps } from './components/IToDoListAeitProps';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IToDoListAeitWebPartProps {
  description: string;
  titleList: string;
}

export default class ToDoListAeitWebPart extends BaseClientSideWebPart<IToDoListAeitWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IToDoListAeitProps> = React.createElement(
      ToDoListAeit,
      {
        onAddListItem: this._onAddListItem,
        // onUpdateListItem: this._onUpdateListItem,
        // onDeleteListItem: this._onDeleteListItem,
        onOpenPanel: this._onOpenPanel,
        titleList: this.properties.titleList,
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _onOpenPanel = (): void => {
    this.context.propertyPane.open();
    
  }

  private _onAddListItem = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    this._addListItem();
      // .then(() => {
      //   this._getListItems()
      //     .then(response => {
      //       this._countries = response;
      //       this.render();
      //     });
      // });
  }

  private _getItemEntityType(): Promise<string> {
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('To%20do%20list')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.ListItemEntityTypeFullName;
      }) as Promise<string>;
  }
  
  private _addListItem(): Promise<SPHttpClientResponse> {
    return this._getItemEntityType()
      .then(spEntityType => {
        const request: any = {};
        request.body = JSON.stringify({
          Title: this.properties.description,
          // Description: this.properties.description,
          '@odata.type': spEntityType
        });
  
        return this.context.spHttpClient.post(
          this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('To%20do%20list')/items`,
          SPHttpClient.configurations.v1,
          request);
        }
      ) ;
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Please add Task Below"
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Description"
                }),
                PropertyPaneTextField('titleList', {
                  label: "Title"
                }),
                PropertyPaneButton("add", {
                  text: "Add Task",
                  buttonType: PropertyPaneButtonType.Primary,
                  onClick: this._onAddListItem.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
