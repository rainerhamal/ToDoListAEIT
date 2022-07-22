import {
  ButtonClickedCallback
} from '../../../models';

import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';


export interface IToDoListAeitProps {
  onOpenPanel?: ButtonClickedCallback;
  onAddListItem?: ButtonClickedCallback;
  onUpdateListItem?: ButtonClickedCallback;
  onDeleteListItem?: ButtonClickedCallback;
  
  dropdownCategory:string;
  titleList: string;
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  label: string;
  onChanged:(option:IDropdownOption, index?: number) => void;
  selectedKey: string | number;
  disabled:boolean;
  statekey: string;
}