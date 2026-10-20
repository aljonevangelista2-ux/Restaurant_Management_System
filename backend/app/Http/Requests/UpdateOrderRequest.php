<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class UpdateOrderRequest extends FormRequest {
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array {
        return ['customer_name'=>'sometimes|required|string|max:120','table_number'=>'nullable|string|max:20','notes'=>'nullable|string|max:1000',
            'items'=>'sometimes|required|array|min:1','items.*.menu_item_id'=>'required_with:items|integer|exists:menu_items,id',
            'items.*.quantity'=>'required_with:items|integer|min:1|max:100'];
    }
}
