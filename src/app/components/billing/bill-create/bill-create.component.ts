import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BasketItem {
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-bill-create',
  templateUrl: './bill-create.component.html',
  styleUrls: ['./bill-create.component.css']
})
export class BillCreateComponent implements OnInit {
  clients: any[] = [];
  products: any[] = [];
  areas: any[] = [];
  basket: BasketItem[] = [];

  clientForm!: FormGroup;
  itemForm!: FormGroup;

  isNewClient = false;
  selectedClientId: string = '';
  selectedArea: string = '';
  filteredSubareas: string[] = [];
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      area: [''],
      subarea: [''],
      address: ['']
    });

    this.itemForm = this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.loadData();
  }

  loadData(): void {
    this.appService.getClients().subscribe(response => this.clients = response.data || response);
    this.appService.getProducts().subscribe(response => this.products = response.data || response);
    this.appService.getAreas().subscribe(response => this.areas = response.data || response);
  }

  onAreaChange(): void {
    const areaName = this.clientForm.get('area')?.value;
    this.selectedArea = areaName;

    this.clientForm.patchValue({ subarea: '' });

    if (areaName) {
      const selectedAreaObj = this.areas.find(a => a.name === areaName);
      if (selectedAreaObj) {
        // Load subareas for the selected area
        this.appService.getSubareas(selectedAreaObj._id).subscribe({
          next: (response) => {
            const subareas = response.data || response;
            this.filteredSubareas = subareas.map((s: any) => s.name);
          },
          error: () => {
            this.filteredSubareas = [];
          }
        });
      } else {
        this.filteredSubareas = [];
      }
    } else {
      this.filteredSubareas = [];
    }
  }

  toggleNewClient(): void {
    this.isNewClient = !this.isNewClient;
    this.selectedClientId = '';
    this.selectedArea = '';
    this.filteredSubareas = [];
    if (!this.isNewClient) {
      this.clientForm.reset();
    }
  }

  saveClient(): void {
    if (this.clientForm.valid) {
      this.appService.addClient(this.clientForm.value).subscribe({
        next: (client) => {
          this.clients.push(client);
          this.selectedClientId = client._id;
          this.isNewClient = false;
          this.selectedArea = '';
          this.filteredSubareas = [];
          this.clientForm.reset();
          this.message.success('Client added successfully');
        },
        error: () => {
          this.message.error('Failed to add client');
        }
      });
    } else {
      Object.values(this.clientForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  addToBasket(): void {
    if (this.itemForm.valid) {
      const { productId, quantity } = this.itemForm.value;
      const product = this.products.find(p => p._id === productId);

      if (!product) return;

      const existing = this.basket.find(i => i.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.basket.push({ product, quantity });
      }

      this.itemForm.patchValue({ productId: null, quantity: 1 });
      this.message.success('Item added to basket');
    }
  }

  removeFromBasket(index: number): void {
    this.basket.splice(index, 1);
    this.message.info('Item removed from basket');
  }

  getTotal(): number {
    return this.basket.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  submitBill(): void {
    if (!this.selectedClientId || this.basket.length === 0) {
      this.message.warning('Please select a client and add items');
      return;
    }

    this.loading = true;
    const payload = {
      clientId: this.selectedClientId,
      items: this.basket.map(i => ({ product: i.product._id, quantity: i.quantity })),
      discount: 0
    };

    this.appService.createBill(payload).subscribe({
      next: (bill) => {
        this.message.success('Bill created successfully!', {
          nzDuration: 3000
        });

        // Reset form
        this.basket = [];
        this.selectedClientId = '';
        this.loading = false;

        // Navigate back to bill list
        this.router.navigate(['/billing']);
      },
      error: () => {
        this.message.error('Failed to create bill');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/billing']);
  }
}
