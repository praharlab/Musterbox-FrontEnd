import { Component, ViewChild, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-page-header',
    templateUrl: './list-page-header.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListPageHeaderComponent {
  displayOptionsCollapsed = false;

  @Input() showOrderBy = true;
  @Input() showadd = [];
  @Input() showreplace = [];
  @Input() showreq = [];
  @Input() showassignRole = [];
  @Input() showAddOnly = [];
  @Input() searchValue = ''
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() name = '';
  @Input() showDisplayMode = true;
  @Input() displayMode = 'list';
  @Input() selectAllState = '';
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = ItemOptionsPerPageArray;
  @Input() itemOrder = { label: 'Product Name', value: 'title' };
  @Input() itemOptionsOrders = [
    { label: 'Product Name', value: 'title' },
    { label: 'Category', value: 'category' },
    { label: 'Status', value: 'status' },
  ];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() reqNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') search: any;
  constructor() { }

  onSelectDisplayMode(mode: string): void {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem(): void {
    this.addNewItem.emit(null);
  }
  onReqNewItem(): void {
    this.reqNewItem.emit(null);
  }
  selectAll(event): void {
    this.selectAllChange.emit(event);
  }
  onChangeItemsPerPage(item): void {
    this.itemsPerPageChange.emit(item);
  }
  onChangeOrderBy(item): void {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  onSearchKeyUp($event): void {
    this.searchKeyUp.emit($event);
  }
}
