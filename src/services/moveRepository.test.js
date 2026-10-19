import {describe,it,expect,vi} from 'vitest';
import {createMove,moveRepository,sanitizeRecord,sanitizeInventory,recordFromState} from './moveRepository.js';
import {createAppStore} from '../redux/store.js';
import {itemAdded} from '../features/inventory/inventorySlice.js';
import {buildCSV} from './inventoryExport.js';
describe('versioned move repository', () => {
  it('round trips inventories, isolates owners, and never overwrites on import', () => {
    const a=createMove('First move'); a.inventory.quantities={'86':3};
    moveRepository.save('alice',a);
    expect(moveRepository.list('bob')).toEqual([]);
    const restored=moveRepository.list('alice')[0];
    expect(restored.inventory.quantities).toEqual({'86':3});
    expect(restored.inventory.selectedCategoryIds).toContain('boxes');
    const imported=moveRepository.import('alice',a);
    expect(imported.move.id).not.toBe(a.move.id);expect(moveRepository.list('alice')).toHaveLength(2);
    moveRepository.remove('alice',a.move.id);expect(moveRepository.list('alice')).toHaveLength(1);
    moveRepository.deleteAll('alice');expect(moveRepository.list('alice')).toEqual([]);
  });
  it('copies guest inventories without sharing record IDs or mutating guests', () => {
    const guest=createMove('Guest move');moveRepository.save('guest',guest);
    moveRepository.copyGuestMoves('alice');
    expect(moveRepository.list('guest')).toHaveLength(1);expect(moveRepository.list('alice')).toHaveLength(1);
    expect(moveRepository.list('alice')[0].move.id).not.toBe(guest.move.id);
    const copy=moveRepository.duplicate('alice',moveRepository.list('alice')[0]);
    expect(copy.move.title).toBe('Guest move (copy)');expect(copy.move.completedAt).toBeNull();
  });
  it('rejects foreign versions and sanitizes corrupt or malicious inventory data', () => {
    expect(()=>sanitizeRecord({version:2,move:{},inventory:{}})).toThrow('supported Roomby inventory');
    const inventory=sanitizeInventory({selectedCategoryIds:['desks','desks','bad','__proto__'],activeCategoryId:'bad',quantities:{'86':2,'87':-1,'88':1000,'89':1.5,'missing':5,'toString':1},customItems:{'custom-valid':{name:'  My chair  ',categoryId:'desks',cf:4,lbs:5},'custom-bad':{name:'Bad',categoryId:'desks',cf:-1,lbs:5}}});
    expect(inventory.selectedCategoryIds).toEqual(['desks','boxes']);
    expect(inventory.quantities).toEqual({'86':2});expect(inventory.activeCategoryId).toBe('desks');
    expect(inventory.customItems['custom-valid'].name).toBe('My chair');expect(inventory.customItems['custom-bad']).toBeUndefined();
    const restored=sanitizeRecord({...createMove(),move:{id:'bad/path',title:'x'.repeat(500),notes:'x'.repeat(3000)},wizard:{step:'unknown',furthestStep:999}});
    expect(restored.move.title).toHaveLength(120);expect(restored.move.notes).toHaveLength(2000);expect(restored.wizard.step).toBe('categories');
    expect(sanitizeInventory(null).quantities).toEqual({});
  });
  it('surfaces storage failures and tolerates unreadable saved data', () => {
    localStorage.setItem('roomby.moves.v1.alice','invalid JSON');expect(moveRepository.list('alice')).toEqual([]);
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Quota exceeded','QuotaExceededError');});
    expect(()=>moveRepository.save('alice',createMove())).toThrow('could not save');
  });
  it('exports consistent totals and neutralizes spreadsheet formula cells', () => {
    const store=createAppStore();store.dispatch({type:'workspace/loaded',payload:createMove('My move')});store.dispatch(itemAdded('86'));
    const record=JSON.parse(JSON.stringify(recordFromState(store.getState())));
    record.inventory.customItems['custom-csv']={id:'custom-csv',name:'=HYPERLINK("https://example.com")',categoryId:'desks',cf:1,lbs:2};
    record.inventory.quantities['custom-csv']=2;
    const csv=buildCSV(record);
    expect(csv).toContain('Small Box');expect(csv).toContain("'=HYPERLINK");expect(csv).toContain('"TOTAL","","","3","","","4","18"');
  });
});
