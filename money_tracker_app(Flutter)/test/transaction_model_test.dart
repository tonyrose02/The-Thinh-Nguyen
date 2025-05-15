import 'package:flutter_test/flutter_test.dart';
import 'package:money_tracker_app/models/transaction_model.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

void main() {
  group('TransactionModel', () {
    test('should correctly deserialize from a map', () {
      final data = {
        'id': '1',
        'label': 'Test Transaction',
        'amount': 100.0,
        'category': 'Income',
        'description': 'Test Description',
        'date': Timestamp.fromDate(DateTime(2023, 12, 1)), // Use Timestamp here
        'isPaid': true,
      };

      final transaction = TransactionModel.fromMap(data, '1');

      expect(transaction.id, '1');
      expect(transaction.label, 'Test Transaction');
      expect(transaction.amount, 100.0);
      expect(transaction.category, 'Income');
      expect(transaction.description, 'Test Description');
      expect(transaction.date, DateTime(2023, 12, 1)); // Check for DateTime
      expect(transaction.isPaid, true);
    });

    test('should correctly serialize to a map', () {
      final transaction = TransactionModel(
        id: '1',
        label: 'Test Transaction',
        amount: 100.0,
        category: 'Income',
        description: 'Test Description',
        date: DateTime(2023, 12, 1),
        isPaid: true,
      );

      final map = transaction.toMap();

      expect(map['label'], 'Test Transaction');
      expect(map['amount'], 100.0);
      expect(map['category'], 'Income');
      expect(map['description'], 'Test Description');
      expect(map['date'], isA<DateTime>());
      expect(map['isPaid'], true);
    });
  });
}
