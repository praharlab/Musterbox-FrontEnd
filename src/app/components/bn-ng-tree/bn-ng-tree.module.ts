/*
 * Local port of bn-ng-tree-lib 1.6.3 (MIT, https://github.com/bearnithi/bn-ng-tree), which
 * only shipped in View Engine format and cannot compile from Angular 16 on. Same selector,
 * inputs, outputs, markup and styles; the unused checkbox feature was left out.
 */
import { Component, EventEmitter, Injectable, Input, NgModule, OnDestroy, OnInit, Output, Pipe, PipeTransform, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface BnTreeNode {
  name: string;
  children?: BnTreeNode[];
  expanded?: boolean;
  bnTreeUUID?: string;
  [key: string]: any;
}

@Injectable()
export class BnNgTreeService {
  private selectedItem = new BehaviorSubject<BnTreeNode | false>(false);
  callSelectedItem$ = this.selectedItem.asObservable();
  private selectedNode: BnTreeNode | Record<string, never> = {};

  generateUUID(): string {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  setSelectedItem(item: BnTreeNode): void {
    this.selectedItem.next(item);
    this.selectedNode = item;
  }

  getSelectedItem(): Partial<BnTreeNode> {
    return this.selectedNode || {};
  }
}

@Pipe({
    name: 'search',
    standalone: false
})
export class SearchPipe implements PipeTransform {
  transform(value: BnTreeNode[], key: string): BnTreeNode[] {
    if (key === undefined) {
      return value;
    }
    const found: BnTreeNode[] = [];
    const walk = (items: BnTreeNode[]) => {
      for (const item of items) {
        if (item.name.toLowerCase().includes(key.toLowerCase())) {
          found.push(item);
        } else if (item.children?.length) {
          walk(item.children);
        }
      }
    };
    walk(value);
    return found;
  }
}

@Component({
    selector: 'bn-search-box',
    template: `<div class="search-container">
    <input type="text" [(ngModel)]="searchText" class="search-box" (input)="search()" placeholder="Search" />
  </div>`,
    styles: [
        '*{box-sizing:border-box}.search-box{padding:.6rem;border:1px solid #dedede;border-radius:6px;width:100%;transition:.2s}.search-box:focus{transform:translateY(-2px);box-shadow:2px 2px 5px #dedede;border-color:#3f51b5;outline:0}',
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchBoxComponent {
  @Output() onSearch = new EventEmitter<string>();
  searchText: string;

  search(): void {
    this.onSearch.emit(this.searchText);
  }
}

@Component({
    selector: 'bn-tree',
    template: `<ul class="tree-view">
      @for (item of items; track item) {
        <li class="node-main {{ theme }}">
          <div class="node__apps" [ngClass]="{ selected: item.bnTreeUUID === getSelectedNode().bnTreeUUID }" (click)="expandNode(item)">
            @if (!item.expanded) {
              <span class="node__icon"><i class="fa fa-folder"></i></span>
            }
            @if (item.expanded) {
              <span class="node__icon"><i class="fa fa-folder-open"></i></span>
            }
            <span class="node__name"> {{ item.name }} </span>
            @if (showNodeCounts) {
              <span class="node__count">({{ item.children ? item.children.length : 0 }})</span>
            }
            @if (showSelectBtn) {
              <span class="node__go" (click)="selectNode(item, $event)"><i class="fa fa-arrow-right"></i></span>
            }
          </div>
          @if (item.children?.length) {
            <div [hidden]="!item.expanded">
              <bn-tree [items]="item.children" [showSelectBtn]="showSelectBtn" [showNodeCounts]="showNodeCounts"></bn-tree>
            </div>
          }
        </li>
      }
    </ul>`,
    styles: [
        "*{box-sizing:border-box}.tree-view{list-style-type:none;transition:.3s ease-in-out}.node__apps{color:#3f51b5;padding:8px;font-size:16px;margin:6px;border-radius:3px;cursor:pointer;transition:.3s ease-in-out}.node__apps:hover{color:#252f69}.node__icon{font-size:20px;margin:0 10px}.node__count{font-size:14px;padding:0 3px;color:#606fc7}.node__go{text-align:right;display:inline-block;font-size:14px;color:#3f51b5;transition:.2s;padding:0 10px}.node__go:hover{transform:translateX(5px)}.node__apps.selected{background:#32408f;color:#fff}.node__apps.selected .node__count,.node__apps.selected .node__go{color:#fff}.primary .node__apps,.primary .node__go{color:#3f51b5}.primary .node__apps:hover{color:#252f69}.primary .node__count{color:#606fc7}.primary .node__apps.selected{background:#32408f;color:#fff}.primary .node__apps.selected .node__count,.primary .node__apps.selected .node__go{color:#fff}.secondary .node__apps,.secondary .node__go{color:#673ab7}.secondary .node__apps:hover{color:#3b216a}.secondary .node__count{color:#8259cb}.secondary .node__apps.selected{background:#512e90;color:#fff}.secondary .node__apps.selected .node__count,.secondary .node__apps.selected .node__go{color:#fff}.tertiary .node__apps,.tertiary .node__go{color:#e91e63}.tertiary .node__apps:hover{color:#930e3b}.tertiary .node__count{color:#ee4c83}.tertiary .node__apps.selected{background:#c1134e;color:#fff}.tertiary .node__apps.selected .node__count,.tertiary .node__apps.selected .node__go{color:#fff}",
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TreeComponent {
  @Input() items: BnTreeNode[] = [];
  @Input() theme: string;
  @Input() showSelectBtn = false;
  @Input() showNodeCounts = false;

  constructor(private treeService: BnNgTreeService) {}

  expandNode(item: BnTreeNode): void {
    item.expanded = item.expanded ? false : !!item.children?.length;
  }

  selectNode(item: BnTreeNode, e: Event): void {
    e.stopPropagation();
    // The original only assigned bnTreeUUID in checkbox mode (unused here), so the
    // `selected` highlight is left exactly as it behaved before the port.
    this.treeService.setSelectedItem(item);
  }

  getSelectedNode(): Partial<BnTreeNode> {
    return this.treeService.getSelectedItem();
  }
}

@Component({
    selector: 'bn-ng-tree',
    template: `<div class="position-relative {{ styleClass }}">
      @if (isSearch) {
        <bn-search-box (onSearch)="search($event)"></bn-search-box>
      }
      <bn-tree [theme]="theme" [showSelectBtn]="showSelectBtn" [showNodeCounts]="showCounts" [items]="items | search: searchkey"></bn-tree>
    </div>`,
    styles: ['*{box-sizing:border-box}'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BnNgTreeComponent implements OnInit, OnDestroy {
  @Input() items: BnTreeNode[] = [];
  @Input() theme = 'default';
  @Input('style-class') styleClass: string;
  @Input('show-counts') showCounts = false;
  @Input('show-select-btn') showSelectBtn = false;
  @Input('show-search') isSearch = true;
  @Output() onChange = new EventEmitter<BnTreeNode>();

  searchkey: string;
  private sub: Subscription;

  constructor(private treeService: BnNgTreeService) {}

  ngOnInit(): void {
    this.sub = this.treeService.callSelectedItem$.subscribe((item) => {
      if (item) {
        this.onChange.emit(item);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  search(key: string): void {
    this.searchkey = key;
  }
}

@NgModule({
  imports: [CommonModule, FormsModule],
  // provided per importing module, like the original library
  providers: [BnNgTreeService],
  declarations: [BnNgTreeComponent, SearchBoxComponent, SearchPipe, TreeComponent],
  exports: [BnNgTreeComponent],
})
export class BnNgTreeModule {}
