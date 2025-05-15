import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/transaction_model.dart';
import '../services/alarm_logic.dart';
import '../services/firestore_service.dart';

class EditTransactionScreen extends StatefulWidget {
  final TransactionModel transaction;

  const EditTransactionScreen({Key? key, required this.transaction})
      : super(key: key);

  @override
  _EditTransactionScreenState createState() => _EditTransactionScreenState();
}

class _EditTransactionScreenState extends State<EditTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final FirestoreService _firestoreService = FirestoreService();

  late String _label;
  late double _amount;
  late String _category;
  late String _description;
  late bool _isPaid;
  late DateTime _selectedDate;
  bool _setAlarm = false;
  String get formattedDate => DateFormat('yyyy/MM/dd').format(_selectedDate);
  @override
  void initState() {
    super.initState();
    _label = widget.transaction.label;
    _amount = widget.transaction.amount;
    _category = widget.transaction.category;
    _description = widget.transaction.description;
    _isPaid = widget.transaction.isPaid;
    _selectedDate = widget.transaction.date;
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final updatedTransaction = TransactionModel(
        id: widget.transaction.id, 
        label: _label,
        amount: _amount,
        category: _category,
        description: _description,
        date: _selectedDate,
        isPaid: _isPaid,
      );

      // Debug Log
      print('Updating transaction with ID: ${updatedTransaction.id}');

      // Ensure the transaction ID is not empty
      if (updatedTransaction.id.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error: Transaction ID is missing')),
        );
        return;
      }

      // Handle alarm scheduling
      if (_setAlarm) {
        scheduleAlarm(
          title: 'Reminder: $_label',
          scheduledDate: _selectedDate,
        );
      }

      // Update transaction in Firestore
      try {
        await _firestoreService.updateTransaction(
          updatedTransaction.id,
          updatedTransaction,
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transaction updated successfully')),
        );
        Navigator.pop(context); // Navigate back after saving
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating transaction: $e')),
        );
      }
    }
  }

  void _pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Transaction'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                initialValue: _label,
                decoration: const InputDecoration(labelText: 'Label'),
                onSaved: (value) => _label = value!,
                validator: (value) =>
                    value == null || value.isEmpty ? 'Enter a label' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _amount.toString(),
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
                onSaved: (value) => _amount = double.parse(value!),
                validator: (value) {
                  final parsedValue = double.tryParse(value ?? '');
                  if (parsedValue == null || parsedValue <= 0) {
                    return 'Enter a valid positive amount';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Text('Category:'),
                  Radio(
                    value: 'Income',
                    groupValue: _category,
                    onChanged: (value) {
                      setState(() {
                        _category = value.toString();
                      });
                    },
                  ),
                  const Text('Income'),
                  Radio(
                    value: 'Expense',
                    groupValue: _category,
                    onChanged: (value) {
                      setState(() {
                        _category = value.toString();
                      });
                    },
                  ),
                  const Text('Expense'),
                ],
              ),
              if (_category == 'Expense')
                CheckboxListTile(
                  title: const Text('Is Paid'),
                  value: _isPaid,
                  onChanged: (value) {
                    setState(() {
                      _isPaid = value!;
                    });
                  },
                ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _description,
                decoration: const InputDecoration(labelText: 'Description'),
                onSaved: (value) => _description = value!,
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Selected Date: ${formattedDate}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  ElevatedButton(
                    onPressed: _pickDate,
                    child: const Text('Pick Date'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              CheckboxListTile(
                title: const Text('Set Alarm'),
                value: _setAlarm,
                onChanged: (value) {
                  setState(() {
                    _setAlarm = value!;
                  });
                },
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _saveChanges,
                child: const Text('Save Changes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
