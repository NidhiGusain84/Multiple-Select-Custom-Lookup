public with sharing class CustomLookkupController{
    @AuraEnabled(cacheable = true)
    public static List<SObject> fetchLookupData(String searchKey, String objectApiName){
        List<sObject> sObjectList = new List<sObject>();
        if(String.isBlank(searchKey)){
            return sObjectList;
        }else {
            String key = '%' + searchKey + '%';
            String query = 'SELECT Id, Name FROM ' + objectApiName + ' WHERE Name LIKE :key ORDER BY Name LIMIT 5';
            sObjectList = Database.query(query, AccessLevel.USER_MODE);
            return sObjectList;
        }
    }

}