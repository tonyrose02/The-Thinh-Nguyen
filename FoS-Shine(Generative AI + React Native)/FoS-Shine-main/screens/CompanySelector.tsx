import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { getCompanyForUser } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth } from '../firebase';
import { RootStackParamList } from '../App';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

interface CompanySelectorProps {
    onCompanySelected: (companyName: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const CompanySelector: React.FC<CompanySelectorProps> = ({ onCompanySelected }) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const result = await getCompanyForUser();
                setCompanies(Array.isArray(result) ? result : [result]);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            })
            .catch((error) => alert(error.message));
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#436623" />
                <ThemedText style={styles.loadingText}>Loading companies...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.headerText}>Select Your Company</ThemedText>
                <FlatList
                    data={companies}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                onCompanySelected(item.name);
                            }}
                        >
                            <ThemedText style={styles.buttonText}>{item.name}</ThemedText>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <ThemedText style={styles.emptyText}>
                            No active subscription
                        </ThemedText>
                    )}
                />
                {/* Back to Login button with grey color and Material UI icon */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleSignOut}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    <ThemedText style={styles.backButtonText}>Back to Login</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#436623',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    backButton: {
        backgroundColor: '#888',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default CompanySelector;
