import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CalendarPopup = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
                position: 'fixed',
                bottom: '60px',
                right: '12px',
                width: '320px',
                backgroundColor: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 10001,
                color: 'white'
            }}
            onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                    {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Days of Week */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: '8px',
                textAlign: 'center'
            }}>
                {weekDays.map(day => (
                    <div key={day} style={{
                        fontSize: '12px',
                        color: '#aaa',
                        fontWeight: 500,
                        padding: '4px 0'
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px'
            }}>
                {calendarDays.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, today);

                    return (
                        <div
                            key={idx}
                            style={{
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                color: isCurrentMonth ? 'white' : '#555',
                                backgroundColor: isToday ? 'var(--accent-color)' : 'transparent',
                                borderRadius: '50%',
                                cursor: 'default',
                                fontWeight: isToday ? 600 : 400
                            }}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                fontSize: '13px',
                color: '#aaa'
            }}>
                {format(today, 'EEEE, MMMM do')}
            </div>
        </motion.div>
    );
};
