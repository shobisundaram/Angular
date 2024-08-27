import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HeaderComponentsService } from '../header-components.service';


@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('scrollBox', { static: true }) scrollBox: ElementRef<HTMLElement>; // Reference to scrollable element

  items: any[] = [];
  show: number | null = null;
  desc = "Basically you need to assign index i value to your show property and according to show and i value you can display show more or show less only for clicked td element only."
  page: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  allDataLoaded: boolean = false;
  windowScrolled: boolean;
  constructor(
    private apiservice: HeaderComponentsService,
  ) { }

  ngOnInit(): void {
    this.loadMoreData();
    this.setupScrollListener()
  }
  setupScrollListener(): void {
    const element = this.scrollBox.nativeElement;

    element.addEventListener('scroll', (event) => {
      // console.log('Element scrolled:', event); // Log scroll event details for debugging
      this.handleScrollEvent(event);
    });
  }
  handleScrollEvent(event: Event): void {
    const target = event.target as HTMLElement;
    // Access scroll properties (e.g., scrollTop, scrollHeight, clientHeight)
    console.log('Scroll position:', target.scrollTop);
    console.log('Scroll clientHeight:', target.clientHeight);
    console.log(target.scrollHeight)

    // Implement your desired logic based on scroll position here
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1) {
      // Reached bottom, potentially load more data
      console.log('Reached bottom of scrollable area!');
      this.loadMoreData()
    }
    if(target.scrollTop > 100){
      this.windowScrolled = true;
    }else{
      this.windowScrolled = false;
    }
  }


  scrollToTop(): void {
    const element = this.scrollBox.nativeElement;
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadMoreData(): void {
    if (this.loading || this.allDataLoaded) {
      return;
    }
    this.loading = true;
    this.apiservice.CommonGetApi(`common/notifications?page=${this.page}&limit=${this.pageSize}`).subscribe({
      next: (res) => {
        if (res.data.notification.length > 0) {
          this.items = [...this.items, ...res.data.notification];
          this.items[0].body = "Basically you need to assign index i value to your show property and according to show and i value you can display show more or show less only for clicked td element only."
          this.page++;
        } else {
          this.allDataLoaded = true;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleShow(index: number): void {
      this.show = (this.show === index) ? null : index;
  }
  
}
