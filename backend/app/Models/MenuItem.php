<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'category', 'price', 'is_available'];
    protected function casts(): array { return ['price' => 'decimal:2', 'is_available' => 'boolean']; }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
}
