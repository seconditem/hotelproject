from random import randint

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
from tools.sms_config import SMS_CONFIG
def send_sms(phone,templateParam):
    client = AcsClient(SMS_CONFIG['ACCESS_KEY_ID'],
    SMS_CONFIG['ACCESS_KEY_SECRET'], 'default')
    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('dysmsapi.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('https') # https | http
    request.set_version('2017-05-25')
    request.set_action_name('SendSms')
    request.add_query_param('PhoneNumbers', phone)
    request.add_query_param('SignName', SMS_CONFIG['SignName'])
    request.add_query_param('TemplateCode',
    SMS_CONFIG['TemplateCode'])
    request.add_query_param('TemplateParam', templateParam)
    response = client.do_action_with_exception(request)
    return str(response, encoding = 'utf-8')
if __name__ == "__main__":
    num = str(randint(10000,1000000))
    res = send_sms('18725882067',{'number':num})
    print(num, '2111111')
    print(res,'1111111')