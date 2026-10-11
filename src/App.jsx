import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// 님의 파이어베이스 고유 설정값
const firebaseConfig = {
  apiKey: "AIzaSyCfce0LxqgTJhON8Hn8c-GPbMVvuA6lmE",
  authDomain: "raid-schedule-f1be5.firebaseapp.com",
  databaseURL: "https://raid-schedule-f1be5-default-rtdb.firebaseio.com",
  projectId: "raid-schedule-f1be5",
  storageBucket: "raid-schedule-f1be5.firebasestorage.app",
  messagingSenderId: "407121970792",
  appId: "1:407121970792:web:3387a428fe70f7b2ac9ddd"
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PARTY_MEMBERS = [
  { id: '1', name: '둅', color: '#3B82F6' },
  { id: '2', name: '툐', color: '#22C55E' },
  { id: '3', name: '츠끼', color: '#0EA5E9' },
  { id: '4', name: '별헤는고래', color: '#EF4444' },
  { id: '5', name: '실론티', color: '#166534' },
  { id: '6', name: '려으', color: '#FBBF24' },
  { id: '7', name: '냥군', color: '#97a9c3' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function App() {
  const [myNickname, setMyNickname] = useState('둅');
  const [currentMonth, setCurrentMonth] = useState(10);
  const [schedules, setSchedules] = useState({});

  // 파이어베이스에서 실시간 데이터 동기화
  useEffect(() => {
    const schedulesRef = ref(db, 'schedules');
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSchedules(data);
      } else {
        setSchedules({});
      }
    });

    return () => unsubscribe();
  }, []);

  // 날짜 클릭 시 파이어베이스로 데이터 저장
  const toggleSchedule = (dateStr) => {
    const currentList = schedules[dateStr] || [];
    let updatedList = [];

    if (currentList.includes(myNickname)) {
      updatedList = currentList.filter((name) => name !== myNickname);
    } else {
      updatedList = [...currentList, myNickname];
    }

    set(ref(db, `schedules/${dateStr}`), updatedList);
  };

  const getMemberColor = (name) => {
    const member = PARTY_MEMBERS.find((m) => m.name === name);
    return member ? member.color : '#ccc';
  };

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  };

  const days = generateCalendarDays(2026, currentMonth);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#FFF9F0', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        
        {/* 타이틀 */}
        <h1 style={{ color: '#78350f', fontSize: '26px', marginBottom: '8px', fontWeight: '800' }}>
          🛡️ 얼레벌레네레팟 캘린더 일정표 (실시간 공유 중 🌐)
        </h1>
        <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '20px' }}>
          날짜를 클릭해 참여 가능 여부를 체크하세요! (6인 이상 모이면 하이라이트)
        </p>

        {/* 내 캐릭터 및 월 선택 */}
        <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '12px', border: '2px solid #fde68a', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', color: '#78350f' }}>내 캐릭터:</label>
            <select
              value={myNickname}
              onChange={(e) => setMyNickname(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', border: '1px solid #d97706', cursor: 'pointer', backgroundColor: '#fffbeb', color: getMemberColor(myNickname) }}
            >
              {PARTY_MEMBERS.map((member) => (
                <option key={member.id} value={member.name} style={{ color: member.color, fontWeight: 'bold' }}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {[10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => setCurrentMonth(m)}
                style={{
                  padding: '8px 16px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currentMonth === m ? '#d97706' : '#fef3c7',
                  color: currentMonth === m ? '#fff' : '#78350f',
                  boxShadow: currentMonth === m ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {m}월
              </button>
            ))}
          </div>
        </div>

        {/* 파티원 현황판 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {PARTY_MEMBERS.map((member) => (
            <div
              key={member.id}
              style={{
                background: member.color,
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                color: '#fff',
                opacity: myNickname === member.name ? 1 : 0.85,
                border: myNickname === member.name ? '2px solid #FF8FAB' : 'none',
                boxShadow: myNickname === member.name ? '0 0 8px rgba(255, 143, 171, 0.8)' : 'none'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{member.name}</div>
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '2px solid #fde68a', overflow: 'hidden', padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>
            {WEEKDAYS.map((day, idx) => (
              <div key={day} style={{ padding: '8px', color: idx === 0 ? '#ef4444' : (idx === 6 ? '#2563eb' : '#78350f'), backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {days.map((dayNum, idx) => {
              if (!dayNum) {
                return <div key={`empty-${idx}`} style={{ minHeight: '90px', background: '#fafafa', borderRadius: '6px' }} />;
              }

              const dateStr = `2026-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const attendees = schedules[dateStr] || [];
              const isMyCommitted = attendees.includes(myNickname);
              const isReady = attendees.length >= 6;

              return (
                <div
                  key={dateStr}
                  onClick={() => toggleSchedule(dateStr)}
                  style={{
                    minHeight: '95px',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    backgroundColor: isReady ? '#dcfce7' : (isMyCommitted ? '#fce7f3' : '#fff'),
                    transition: 'background-color 0.2s',
                    position: 'relative',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>{dayNum}</span>
                    {isReady && (
                      <span style={{ fontSize: '9px', background: '#16a34a', color: '#fff', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>
                        레이드 가능!
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
                    {attendees.map((name) => {
                      const memberColor = getMemberColor(name);
                      const isMe = name === myNickname;
                      return (
                        <span
                          key={name}
                          style={{
                            fontSize: '10px',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: memberColor,
                            color: '#fff',
                            fontWeight: 'bold',
                            border: isMe ? '1.5px solid #FF8FAB' : 'none'
                          }}
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}