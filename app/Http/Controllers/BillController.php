<?php

namespace App\Http\Controllers;
use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bills = Bill::all();
        return response()->json($bills);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_number' => 'required|integer',
            'total_amount' => 'required|numeric',
            'sub_total' => 'required|numeric',
            'tax' => 'required|numeric',
            'payment_mode' => 'required|string',
            'cart_items' => 'required|array',
        ]);

        $bill = Bill::create($request->all());
        return response()->json(['message' => 'Bill Created Successfully!', 'bill' => $bill]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
