import { useState } from "react";

export default function App() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", total: "", combat: "", kc: "" });
  const [weights, setWeights] = useState({ total: 0.5, combat: 0.3, kc: 0.2 });

  const addMember = () => {
    if (!newMember.name) return;
    setMembers([...members, { ...newMember, id: Date.now() }]);
    setNewMember({ name: "", total: "", combat: "", kc: "" });
  };

  const removeMember = (id) => setMembers(members.filter(m => m.id !== id));

  const calcScore = (m) =>
    (Number(m.total) * weights.total +
     Number(m.combat) * weights.combat +
     Number(m.kc) * weights.kc).toFixed(1);

  const ranked = [...members].sort((a,b) => calcScore(b) - calcScore(a));

  const rankName = (score) => {
    const s = Number(score);
    if (s >= 1500) return "Diamond";
    if (s >= 1000) return "Gold";
    if (s >= 500)  return "Silver";
    return "Bronze";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">OSRS Clan Rank Calculator</h1>

      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {["name","total","combat","kc"].map((field) => (
            <input
              key={field}
              type={field==="name"?"text":"number"}
              placeholder={field==="name"?"Name":field}
              className="px-3 py-1 rounded bg-gray-700"
              value={newMember[field]}
              onChange={(e)=>setNewMember({...newMember,[field]:e.target.value})}
            />
          ))}
          <button
            onClick={addMember}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">
            Add
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Weights</h2>
        {Object.keys(weights).map((w) => (
          <div key={w} className="mb-2">
            <label className="capitalize mr-2">{w} {Math.round(weights[w]*100)}%</label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={weights[w]}
              onChange={e=>setWeights({...weights,[w]:parseFloat(e.target.value)})}
            />
          </div>
        ))}
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Name</th><th>Total</th><th>Combat</th><th>KC</th><th>Score</th><th>Rank</th><th></th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(m => {
            const score = calcScore(m);
            return (
              <tr key={m.id} className="border-b border-gray-800">
                <td>{m.name}</td>
                <td>{m.total}</td>
                <td>{m.combat}</td>
                <td>{m.kc}</td>
                <td>{score}</td>
                <td className="font-semibold">{rankName(score)}</td>
                <td>
                  <button onClick={()=>removeMember(m.id)} className="text-red-400 hover:underline">x</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
