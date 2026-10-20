<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller {
    public function index() {
        return response()->json(['data'=>[
            'menu_items'=>MenuItem::count(),
            'total_orders'=>Order::count(),
            'pending_orders'=>Order::where('status','pending')->count(),
            'completed_orders'=>Order::where('status','completed')->count(),
            'completed_sales'=>(float)Order::where('status','completed')->sum('total'),
            'recent_orders'=>Order::with('user:id,name')->latest()->take(5)->get(['id','user_id','customer_name','status','total','created_at'])
        ]]);
    }
}
