<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreMenuItemRequest extends FormRequest {
    public function authorize(): bool { return $this->user()?->role === 'admin'; }
    public function rules(): array { return ['name'=>'required|string|max:120','description'=>'nullable|string|max:1000','category'=>'required|string|max:80','price'=>'required|numeric|min:0.01|max:99999999','is_available'=>'sometimes|boolean']; }
}
