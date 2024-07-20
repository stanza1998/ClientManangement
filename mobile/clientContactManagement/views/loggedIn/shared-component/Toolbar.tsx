import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ToolbarProps {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    style?: ViewStyle;
}

const Toolbar: React.FC<ToolbarProps> = ({ left, center, right, style }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.left}>{left}</View>
            <View style={styles.center}>{center}</View>
            <View style={styles.right}>{right}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff', // Customize as needed
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    left: {
        flex: 1,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
});

export default Toolbar;
