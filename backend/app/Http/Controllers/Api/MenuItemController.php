<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller {
    public function index(Request $request) {
        $query = MenuItem::query();
        if ($request->filled('search')) $query->where(fn($q)=>$q->where('name','like','%'.$request->search.'%')->orWhere('description','like','%'.$request->search.'%'));
        if ($request->filled('category')) $query->where('category',$request->category);
        if ($request->has('available') && $request->available !== '') $query->where('is_available',filter_var($request->available,FILTER_VALIDATE_BOOLEAN));
        return MenuItemResource::collection($query->orderBy('name')->paginate(8)->withQueryString());
    }
    public function store(StoreMenuItemRequest $request) {
        $item = MenuItem::create($request->validated());
        return (new MenuItemResource($item))->response()->setStatusCode(201);
    }
    public function show(MenuItem $menuItem) { return new MenuItemResource($menuItem); }
    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem) {
        $menuItem->update($request->validated()); return new MenuItemResource($menuItem->fresh());
    }
    public function destroy(MenuItem $menuItem) {
        if ($menuItem->orderItems()->exists()) return response()->json(['message'=>'This menu item is used by existing orders. Mark it unavailable instead.'], 422);
        $menuItem->delete(); return response()->noContent();
    }
    public function categories() { return response()->json(['data'=>MenuItem::query()->distinct()->orderBy('category')->pluck('category')]); }
}
