import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/transaction_model.dart';
import '../services/firestore_service.dart';
import '../services/alarm_logic.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({Key? key}) : super(key: key);

  @override
  _AddTransactionScreenState createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final FirestoreService _firestoreService = FirestoreService();

  String _label = '';
  double _amount = 0.0;
  String _category = 'Income';
  String _description = '';
  bool _isPaid = false;
  DateTime _selectedDate = DateTime.now();
  bool _setAlarm = false;
  String get formattedDate => DateFormat('yyyy/MM/dd').format(_selectedDate);
  void _pickDate() async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (pickedDate != null) {
      setState(() {
        _selectedDate = pickedDate;
      });
    }
  }

  Future<void> _saveTransaction() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    _formKey.currentState!.save();

    // Create a new transaction object
    final transaction = TransactionModel(
      id: '', 
      label: _label,
      amount: _amount,
      category: _category,
      description: _description,
      date: _selectedDate,
      isPaid: _isPaid,
    );

    try {
      // Save transaction to Firestore
      await _firestoreService.addTransaction( transaction);

      // Schedule alarm if user opted for it
      if (_setAlarm) {
        scheduleAlarm(
          title: 'Reminder for $_label',
          scheduledDate: _selectedDate,
        );
      }

      // Navigate back after saving
      Navigator.pop(context);
    } catch (e) {
      _showErrorDialog(e.toString());
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Transaction'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Label'),
                onSaved: (value) => _label = value ?? '',
                validator: (value) =>
                    value == null || value.isEmpty ? 'Enter a label' : null,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
                onSaved: (value) =>
                    _amount = value == null ? 0 : double.parse(value),
                validator: (value) =>
                    value == null || double.tryParse(value) == null
                        ? 'Enter a valid amount'
                        : null,
              ),
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
                      _isPaid = value ?? false;
                    });
                  },
                ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Description'),
                onSaved: (value) => _description = value ?? '',
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(formattedDate == null
                      ? 'Pick a Date'
                      : formattedDate.toString()),
                  ElevatedButton(
                    onPressed: _pickDate,
                    child: const Text('Pick Date'),
                  ),
                ],
              ),
              CheckboxListTile(
                title: const Text('Set Alarm'),
                value: _setAlarm,
                onChanged: (value) {
                  setState(() {
                    _setAlarm = value ?? false;
                  });
                },
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _saveTransaction,
                child: const Text('Save Transaction'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
