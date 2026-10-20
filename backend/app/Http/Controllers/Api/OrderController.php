<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller {
    public function index(Request $request) {
        $query = Order::with(['user:id,name','items.menuItem']);
        if ($request->filled('search')) $query->where(fn($q)=>$q->where('customer_name','like','%'.$request->search.'%')->orWhere('id',$request->search));
        if ($request->filled('status')) $query->where('status',$request->status);
        return OrderResource::collection($query->latest()->paginate(8)->withQueryString());
    }
    public function store(StoreOrderRequest $request) {
        $data=$request->validated();
        $order=DB::transaction(function() use ($data,$request) {
            $order=Order::create(['user_id'=>$request->user()->id,'customer_name'=>$data['customer_name'],'table_number'=>$data['table_number']??null,'notes'=>$data['notes']??null,'status'=>'pending','total'=>0]);
            $this->syncItems($order,$data['items']);
            return $order;
        });
        return (new OrderResource($order->load(['user:id,name','items.menuItem'])))->response()->setStatusCode(201);
    }
    public function show(Order $order) { return new OrderResource($order->load(['user:id,name','items.menuItem'])); }
    public function update(UpdateOrderRequest $request, Order $order) {
        if (!in_array($order->status,['pending','preparing'],true)) return response()->json(['message'=>'Only pending or preparing orders can be edited.'],422);
        $data=$request->validated();
        DB::transaction(function() use ($data,$order) {
            $order->update(collect($data)->only(['customer_name','table_number','notes'])->all());
            if (isset($data['items'])) { $order->items()->delete(); $this->syncItems($order,$data['items']); }
        });
        return new OrderResource($order->fresh()->load(['user:id,name','items.menuItem']));
    }
    public function destroy(Request $request, Order $order) {
        if ($request->user()->role !== 'admin') return response()->json(['message'=>'Only admin can delete orders.'],403);
        $order->delete(); return response()->noContent();
    }
    public function updateStatus(Request $request, Order $order) {
        $data=$request->validate(['status'=>['required',Rule::in(['pending','preparing','ready','completed','cancelled'])]]);
        $allowed=['pending'=>['preparing','cancelled'],'preparing'=>['ready','cancelled'],'ready'=>['completed'],'completed'=>[],'cancelled'=>[]];
        if (!in_array($data['status'],$allowed[$order->status]??[],true)) return response()->json(['message'=>"Cannot move order from {$order->status} to {$data['status']}."],422);
        $order->update(['status'=>$data['status']]);
        return new OrderResource($order->fresh()->load(['user:id,name','items.menuItem']));
    }
    private function syncItems(Order $order, array $items): void {
        $total=0;
        foreach ($items as $line) {
            $menu=MenuItem::findOrFail($line['menu_item_id']);
            if (!$menu->is_available) abort(422,'One or more menu items are currently unavailable.');
            $subtotal=(float)$menu->price*(int)$line['quantity'];
            $order->items()->create(['menu_item_id'=>$menu->id,'quantity'=>$line['quantity'],'unit_price'=>$menu->price,'subtotal'=>$subtotal]);
            $total+=$subtotal;
        }
        $order->update(['total'=>$total]);
    }
}
