import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
 products = [
  {
    image: "assets/images/product-1.svg",
    title: "Product Name",
    price: "$149",
  },
  {
    image: "assets/images/product-2.svg",
    title: "Product Name",
    price: "$149",
  },
  {
    image: "assets/images/product-3.svg",
    title: "Product Name",
    price: "$149",
  },
  {
    image: "assets/images/product-4.svg",
    title: "Product Name",
    price: "$149",
  },
  {
    image: "assets/images/product-5.svg",
    title: "Product Name",
    price: "$149",
  },
  {
    image: "assets/images/product-6.svg",
    title: "Product Name",
    price: "$149",
  },
 ]
}
