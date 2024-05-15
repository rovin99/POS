<?php

namespace App\Http\Controllers;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    

    /**
     * Show the form for creating a new resource.
     */
    public function index()
    {
        $items = Item::all();
        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{   
    $data = $request->all();

    switch ($data['category']) {
        case 'drinks':
            $data['discount'] = 20;
            break;
        case 'rice':
            $data['discount'] = 10;
            break;
        case 'noodles':
            $data['discount'] = 15;
            break;
        default:
            $data['discount'] = 0; // Default case if none match
    }

    $item = Item::create($data);

    return response()->json($item, 201);
}


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
{
    $itemId = $request->input('itemId');
    $item = Item::findOrFail($itemId);
    $item->update($request->except('itemId'));
    return response()->json($item);
}

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
{
    $itemId = $request->input('itemId');
    $item = Item::findOrFail($itemId);
    $item->delete();
    return response()->json(null, 204);
}
public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $imageName = time().'.'.$request->file->extension();  
    $request->file->move(public_path('uploads'), $imageName);

    return response()->json(['url' => asset('uploads/'.$imageName)]);
}
 /** Out of Stock Itmes */
 public function outOfStock(){
    $items = Item::where('stock', '<', 1)->get();
    return response()->json($items);

 }
}
