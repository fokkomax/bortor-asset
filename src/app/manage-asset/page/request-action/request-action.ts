import { Component } from '@angular/core';
import { MenuAction } from "../menu-action/menu-action";
import { HistoryAction } from "../history-action/history-action";

@Component({
  selector: 'app-request-action',
  imports: [MenuAction, HistoryAction],
  templateUrl: './request-action.html',
  styleUrl: './request-action.scss',
})
export class RequestAction {

}
