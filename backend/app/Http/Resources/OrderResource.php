<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class OrderResource extends JsonResource {
    public function toArray(Request $request): array {
        return ['id'=>$this->id,'customer_name'=>$this->customer_name,'table_number'=>$this->table_number,
            'status'=>$this->status,'notes'=>$this->notes,'total'=>(float)$this->total,
            'created_at'=>$this->created_at,'user'=>$this->whenLoaded('user', fn()=>['id'=>$this->user->id,'name'=>$this->user->name]),
            'items'=> $this->whenLoaded('items', fn()=> $this->items->map(fn($i)=>[
                'id'=>$i->id,'menu_item_id'=>$i->menu_item_id,'name'=>$i->menuItem?->name,
                'quantity'=>$i->quantity,'unit_price'=>(float)$i->unit_price,'subtotal'=>(float)$i->subtotal
            ]))];
    }
}
