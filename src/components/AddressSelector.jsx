import { useState, useEffect, useRef } from 'react';
import { X, Phone, User, MapPin, Map, Check, Star } from 'lucide-react';
import { regions } from '../data/regions';

export default function AddressSelector({
  open,
  onClose,
  onSelect,
  initialAddress,
  addressCount = 0,
  onToast
}) {
  const isEdit = Boolean(initialAddress && initialAddress.receiver);
  const isFirst = addressCount === 0;

  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detail, setDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [errors, setErrors] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (initialAddress) {
        setReceiver(initialAddress.receiver || '');
        setPhone(initialAddress.phone || '');
        setProvince(initialAddress.province || '');
        setCity(initialAddress.city || '');
        setDistrict(initialAddress.district || '');
        setDetail(initialAddress.detail || '');
        setIsDefault(Boolean(initialAddress.isDefault) || isFirst);
      } else {
        setReceiver('');
        setPhone('');
        setProvince('');
        setCity('');
        setDistrict('');
        setDetail('');
        setIsDefault(isFirst);
      }
      setErrors({});
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [open, initialAddress, isFirst]);

  if (!open) return null;

  const provinceObj = regions.find((p) => p.name === province);
  const cities = provinceObj ? provinceObj.cities : [];

  const cityObj = cities.find((c) => c.name === city);
  const districts = cityObj ? cityObj.districts : [];

  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setProvince(value);
    setCity('');
    setDistrict('');
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setDistrict('');
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!receiver.trim()) newErrors.receiver = '请输入收货人姓名';
    if (!phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = '请输入正确的11位手机号';
    }
    if (!province) newErrors.region = '请选择所在省份';
    if (province && !city) newErrors.region = '请选择所在城市';
    if (province && city && !district) newErrors.region = '请选择所在区/县';
    if (!detail.trim()) newErrors.detail = '请输入详细地址';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      if (onToast) {
        const firstMsg =
          errors.receiver || errors.phone || errors.region || errors.detail || '请填写完整信息';
        onToast(firstMsg, 'error');
      }
      return;
    }
    const finalDefault = isFirst ? true : isDefault;
    onSelect({
      receiver: receiver.trim(),
      phone: phone.trim(),
      province,
      city,
      district,
      detail: detail.trim(),
      isDefault: finalDefault
    });
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all outline-none';
  const inputNormal =
    'border-slate-200 bg-slate-50 text-slate-800 focus:border-eco-400 focus:bg-white focus:ring-4 focus:ring-eco-100/50';
  const inputError = 'border-red-300 bg-red-50 text-red-700';

  const selectBase =
    'flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all outline-none bg-white appearance-none cursor-pointer min-h-[44px]';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="w-9" />
            <h2 className="font-bold text-slate-900 text-lg">
              {isEdit ? '编辑收货地址' : '新增收货地址'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={contentRef}
          className="overflow-y-auto p-5 space-y-5 scroll-smooth"
          style={{ flex: 1, maxHeight: 'calc(95vh - 200px)', WebkitOverflowScrolling: 'touch' }}
        >
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <User className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
              收货人 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="请输入收货人姓名"
              className={`${inputBase} ${errors.receiver ? inputError : inputNormal}`}
            />
            {errors.receiver && (
              <span className="text-xs text-red-500 mt-1.5 block">{errors.receiver}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <Phone className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
              手机号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="请输入11位手机号"
              className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
            />
            {errors.phone && (
              <span className="text-xs text-red-500 mt-1.5 block">{errors.phone}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <MapPin className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
              所在地区 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative sm:flex-1">
                <select
                  value={province}
                  onChange={handleProvinceChange}
                  className={`${selectBase} ${
                    errors.region ? 'border-red-300' : 'border-slate-200 focus:border-eco-400'
                  } text-slate-700`}
                >
                  <option value="">请选择省</option>
                  {regions.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative sm:flex-1">
                <select
                  value={city}
                  onChange={handleCityChange}
                  disabled={!province}
                  className={`${selectBase} ${
                    errors.region ? 'border-red-300' : 'border-slate-200 focus:border-eco-400'
                  } ${!province ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-700'}`}
                >
                  <option value="">请选择市</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative sm:flex-1">
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  disabled={!city}
                  className={`${selectBase} ${
                    errors.region ? 'border-red-300' : 'border-slate-200 focus:border-eco-400'
                  } ${!city ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-700'}`}
                >
                  <option value="">请选择区/县</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {(province || city || district) && (
              <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                <Map className="w-3 h-3" />
                {[province, city, district].filter(Boolean).join(' / ') || '请选择完整地区'}
              </div>
            )}
            {errors.region && (
              <span className="text-xs text-red-500 mt-1.5 block">{errors.region}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <Map className="w-4 h-4 inline-block mr-1.5 text-eco-600" />
              详细地址 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="街道、楼栋、门牌号等信息"
              className={`${inputBase} resize-none ${errors.detail ? inputError : inputNormal}`}
            />
            {errors.detail && (
              <span className="text-xs text-red-500 mt-1.5 block">{errors.detail}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-eco-50 to-emerald-50 border border-eco-100">
            <div className="flex items-center gap-2.5">
              <Star
                className={`w-4 h-4 ${isDefault || isFirst ? 'text-yellow-500 fill-yellow-400' : 'text-slate-400'}`}
              />
              <div>
                <p className="text-sm font-bold text-slate-800">设为默认地址</p>
                <p className="text-xs text-slate-500">
                  {isFirst ? '第一个地址将自动设为默认' : '下单时优先使用此地址'}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => setIsDefault(!isDefault)}
              className={`relative w-12 h-7 rounded-full transition-all ${
                isFirst
                  ? 'bg-slate-300 cursor-not-allowed'
                  : isDefault
                  ? 'bg-gradient-to-r from-eco-500 to-eco-600'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all flex items-center justify-center ${
                  isDefault || isFirst ? 'left-[22px]' : 'left-0.5'
                }`}
              >
                {(isDefault || isFirst) && (
                  <Check className="w-3.5 h-3.5 text-eco-600" />
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4 flex gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-eco-500/30 hover:shadow-xl hover:shadow-eco-500/40 transition-all"
          >
            <Check className="w-4 h-4 inline-block mr-1" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
