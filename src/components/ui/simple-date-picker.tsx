import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SimpleDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleDatePicker({ value, onChange, placeholder }: SimpleDatePickerProps) {
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const selectedDate = value ? new Date(value) : null;
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const isSelected = selectedDate && dateString === value;
    const isToday = dateString === new Date().toISOString().split('T')[0];
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => {
          onChange(dateString);
          setShowCalendar(false);
        }}
        className={`p-2 text-sm rounded hover:bg-accent ${
          isSelected ? 'bg-primary text-primary-foreground' : 
          isToday ? 'bg-accent font-semibold' : ''
        }`}
      >
        {day}
      </button>
    );
  }
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  return (
    <div className="relative">
      <div className="flex">
        <Input
          type="text"
          value={value ? new Date(value).toLocaleDateString() : ''}
          placeholder={placeholder || "Select date"}
          readOnly
          className="cursor-pointer"
          onClick={() => setShowCalendar(!showCalendar)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {showCalendar && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-background border rounded-md shadow-lg p-3 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="p-2 text-xs font-medium text-muted-foreground text-center">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
      )}
      
      {showCalendar && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}