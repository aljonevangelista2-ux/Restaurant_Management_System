<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        $admin=User::updateOrCreate(['email'=>'admin@restaurant.test'],['name'=>'Restaurant Admin','password'=>Hash::make('password'),'role'=>'admin']);
        $staff=User::updateOrCreate(['email'=>'staff@restaurant.test'],['name'=>'Dining Staff','password'=>Hash::make('password'),'role'=>'staff']);
        $menu=[
            ['Grilled Chicken','Herb-marinated chicken with rice','Main Course',249],
            ['Beef Burger','Beef patty, lettuce, tomato and house sauce','Main Course',189],
            ['Classic Carbonara','Creamy pasta with bacon and parmesan','Pasta',219],
            ['Vegetable Spring Rolls','Crispy rolls with sweet chili dip','Appetizer',99],
            ['Caesar Salad','Romaine, croutons and Caesar dressing','Salad',149],
            ['Fish and Chips','Crispy fish with fries','Main Course',229],
            ['Mango Shake','Fresh mango blended with milk','Drinks',89],
            ['Iced Coffee','Chilled coffee with milk','Drinks',79],
            ['Chocolate Cake','Moist chocolate cake slice','Dessert',119],
            ['Pancakes','Fluffy pancakes with syrup','Breakfast',129],
            ['Garlic Rice','Fragrant garlic fried rice','Sides',49],
            ['Club Sandwich','Triple-layer sandwich with fries','Snacks',159],
            ['Lemonade','Fresh lemon drink','Drinks',59],
            ['Cheese Pizza','Personal pizza with mozzarella','Main Course',199],
            ['Halo-Halo','Filipino shaved ice dessert','Dessert',109],
            ['Tomato Soup','Warm tomato soup','Appetizer',89],
            ['Pork Sisig','Sizzling chopped pork with rice','Main Course',199],
            ['Tuna Sandwich','Tuna salad on toasted bread','Snacks',119],
            ['Fruit Bowl','Seasonal fresh fruit','Dessert',99],
            ['Hot Tea','Freshly brewed tea','Drinks',45],
        ];
        foreach ($menu as [$name,$description,$category,$price]) MenuItem::updateOrCreate(['name'=>$name],['description'=>$description,'category'=>$category,'price'=>$price,'is_available'=>true]);
        $items=MenuItem::all()->keyBy('name');
        $samples=[
            ['Maria Santos','4','pending',['Grilled Chicken'=>2,'Mango Shake'=>1]],
            ['Jose Reyes','2','preparing',['Beef Burger'=>1,'Iced Coffee'=>1]],
            ['Ana Cruz','6','ready',['Classic Carbonara'=>1,'Lemonade'=>2]],
            ['Paolo Garcia','1','completed',['Pork Sisig'=>2,'Garlic Rice'=>2]],
            ['Liza Mendoza','3','completed',['Cheese Pizza'=>1,'Chocolate Cake'=>1]],
        ];
        foreach ($samples as [$customer,$table,$status,$lines]) {
            $order=Order::create(['user_id'=>$staff->id,'customer_name'=>$customer,'table_number'=>$table,'status'=>$status,'notes'=>null,'total'=>0]);
            $total=0;
            foreach ($lines as $name=>$qty) {
                $item=$items[$name]; $subtotal=(float)$item->price*$qty; $total+=$subtotal;
                $order->items()->create(['menu_item_id'=>$item->id,'quantity'=>$qty,'unit_price'=>$item->price,'subtotal'=>$subtotal]);
            }
            $order->update(['total'=>$total]);
        }
    }
}
